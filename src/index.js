import React, { Component, Fragment } from "react";
import Card from "./Card/Card";
import PropTypes from "prop-types";
import "./styles.css";
import Spinner from "./Spinner/Spinner";

class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      loading: false,
      data: this.props.data,
      styles: this.props.style || {}
      // classNamePrefix: this.props.classNamePrefix || ""
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
    scrollRef.addEventListener("scroll", () => {
      if (
        scrollRef.scrollTop + scrollRef.clientHeight >=
        scrollRef.scrollHeight
      ) {
        this.fetchData();
      }
    });
  }

  fetchData = () => {
    //TODO fetch data

    this.setState({ ...this.state, loading: true }, () => {
      console.log("fetch data");

      // setTimeout(() => {
      //   this.setState({ ...this.state, loading: false }, () =>
      //     console.log("fetch data")
      //   );
      // }, 1000);
    });
  };

  render() {
    const { show, styles, loading, data } = this.state;
    const {
      markAllAsRead,
      displaySeeAll,
      iconClass,
      classNamePrefix
    } = this.props;
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
        <div className="notification-icon">
          <i
            className={iconClass}
            style={{
              fontSize: "2rem",
              color: show ? "grey" : "#142545"
            }}
            onClick={() => this.setState({ show: !show })}
          ></i>
          <div className={`${classNamePrefix}notification-count`}>
            {Object.keys(data).length}
          </div>
        </div>

        <div
          className={`${classNamePrefix}notification-container`}
          ref={this.notificationRef}
          style={{
            ...styles,
            visibility: show ? "visible" : "hidden",
            opacity: show ? 1 : 0
          }}
        >
          <div className={`${classNamePrefix}notification-header`}>
            <div className={`${classNamePrefix}notification-title`}>
              {this.props.header.title}
            </div>
            <div className={`${classNamePrefix}options`}>
              <div
                className={`${classNamePrefix}option`}
                onClick={markAllAsRead}
              >
                {this.props.header.option}
              </div>
            </div>
          </div>

          <div
            className={`${classNamePrefix}notification-items`}
            ref={this.scrollRef}
          >
            {cardList}
            <div className="loader">{loading && <Spinner />}</div>
          </div>

          {displaySeeAll && (
            <div className={`${classNamePrefix}notification-footer`}>
              <a href={seeAll}>
                <span className={`${classNamePrefix}notification-see_all`}>
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
