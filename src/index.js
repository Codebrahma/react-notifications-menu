import React, { Component, Fragment } from "react";
import Card from "./Card/Card";
import PropTypes from "prop-types";
import Spinner from "./Spinner/Spinner";
import "./styles.css";

class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      loading: false,
      data: this.props.data,
      styles: this.props.style || {}
    };
    this.scrollRef = React.createRef();
    this.notificationRef = React.createRef();
  }

  componentDidMount() {
    const notificationRef = this.notificationRef.current;
    const scrollRef = this.scrollRef.current;

    if (typeof this.props.data === "string") {
      fetch(this.state.data)
        .then(response => response.json())
        .then(data => this.setState({ data }))
        .catch(err => console.log(err));
    }

    if (notificationRef.offsetLeft > notificationRef.offsetWidth) {
      this.setState({
        style: {
          transform: `translateX(-${notificationRef.offsetWidth}px)`
        }
      });
    }
    if (Object.keys(this.state.data).length > 0) {
      scrollRef.addEventListener("scroll", () => {
        if (
          scrollRef.scrollTop + scrollRef.clientHeight >=
          scrollRef.scrollHeight
        ) {
          this.fetchData();
        }
      });
    }
  }

  fetchData = () => {
    this.setState({ ...this.state, loading: true }, () => {
      console.log("fetch data");
    });
  };

  render() {
    const { show, styles, loading, data } = this.state;
    const {
      markAllAsRead,
      displaySeeAll,
      iconClass,
      classNamePrefix,
      icon
    } = this.props;

    const dataLength = Object.keys(data).length;
    const CustomComponent = this.props.renderItem;
    const { seeAll } = this.props.links;

    const cardList = this.props.renderItem
      ? Object.keys(this.state.data).map(key => (
          <CustomComponent
            key={key}
            {...this.props}
            {...this.state.data[key]}
          />
        ))
      : Object.keys(this.state.data).map(key => (
          <Card key={key} {...this.props} {...this.state.data[key]} />
        ));

    return (
      <Fragment>
        <div
          className={
            classNamePrefix
              ? `${classNamePrefix}-notification-icon`
              : "notification-icon"
          }
        >
          {icon ? (
            <img
              src={icon}
              alt="notify"
              onClick={() => this.setState({ show: !show })}
            />
          ) : (
            <i
              className={iconClass}
              style={{
                fontSize: "1.5rem",
                color: show ? "grey" : "#142545"
              }}
              onClick={() => this.setState({ show: !show })}
            ></i>
          )}
          {dataLength > 0 && (
            <div
              className={
                classNamePrefix
                  ? `${classNamePrefix}-notification-count`
                  : "notification-count"
              }
            >
              {Object.keys(data).length}
            </div>
          )}
        </div>

        <div
          className={
            classNamePrefix
              ? `${classNamePrefix}-notification-container`
              : "notification-container"
          }
          ref={this.notificationRef}
          style={{
            ...styles,
            visibility: show ? "visible" : "hidden",
            opacity: show ? 1 : 0
          }}
        >
          <div
            className={
              classNamePrefix
                ? `${classNamePrefix}-notification-header`
                : "notification-header"
            }
          >
            <div
              className={
                classNamePrefix
                  ? `${classNamePrefix}-notification-title`
                  : "notification-title"
              }
            >
              {this.props.header.title}
            </div>
            <div
              className={
                classNamePrefix ? `${classNamePrefix}-options` : "options"
              }
            >
              <div
                className={
                  classNamePrefix ? `${classNamePrefix}-option` : "option"
                }
                onClick={markAllAsRead}
              >
                {this.props.header.option}
              </div>
            </div>
          </div>

          <div
            className={
              classNamePrefix
                ? `${classNamePrefix}-notification-items`
                : "notification-items"
            }
            ref={this.scrollRef}
          >
            {dataLength > 0 ? (
              <Fragment>
                {cardList}
                <div className="loader">{loading && <Spinner />}</div>
              </Fragment>
            ) : (
              <div
                className={
                  classNamePrefix
                    ? `${classNamePrefix}-empty-notifications`
                    : "empty-notifications"
                }
              >
                <div>No Notifications</div>
              </div>
            )}
          </div>

          {displaySeeAll && (
            <div
              className={
                classNamePrefix
                  ? `${classNamePrefix}-notification-footer`
                  : "notification-footer"
              }
            >
              <a href={seeAll}>
                <span
                  className={
                    classNamePrefix
                      ? `${classNamePrefix}-notification-see_all`
                      : "notification-see_all"
                  }
                >
                  see all
                </span>
              </a>
            </div>
          )}
        </div>
      </Fragment>
    );
  }
}

Notifications.defaultProps = {
  displaySeeAll: true,
  CustomComponent: null,
  iconClass: "fas fa-bell",
  header: { title: "Notifications", option: "Mark all as read" },
  classNamePrefix: "",
  cardOptions: true
};

Notifications.propTypes = {
  markAllAsRead: PropTypes.func.isRequired,
  links: PropTypes.objectOf(PropTypes.string)
};

export default Notifications;
