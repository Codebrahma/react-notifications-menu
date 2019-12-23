import React, { Component, Fragment } from "react";
import Card from "./Card/Card";
import PropTypes from "prop-types";
import Spinner from "./Spinner/Spinner";
import defaultIcon from "./assets/default_bell.svg";
import "./styles.scss";

class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      loading: false,
      data: this.props.data,
      styles: this.props.style || {},
      classes: this.classNameGenerator()
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
        styles: {
          ...this.state.styles,
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

  classNameGenerator = () => {
    const prefix = this.props.classNamePrefix
      ? `${this.props.classNamePrefix}-`
      : "";
    const classes = {
      "notification-icon": `${prefix}notification-icon`,
      "notification-count": `${prefix}notification-count`,
      "notification-container": `${prefix}notification-container`,
      "notification-header": `${prefix}notification-header`,
      "header-title": `${prefix}header-title`,
      "header-option": `${prefix}header-option`,
      "notification-items": `${prefix}notification-items`,
      "empty-notifications": `${prefix}empty-notifications`,
      "notification-footer": `${prefix}notification-footer`,
      "notification-see_all": `${prefix}notification-see_all`
    };
    return classes;
  };

  render() {
    const { show, styles, loading, data, classes } = this.state;
    const { displaySeeAll, icon } = this.props;

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
        <div className={classes["notification-icon"]}>
          <img
            src={icon ? icon : defaultIcon}
            alt="notify"
            onClick={() => this.setState({ show: !show })}
          />

          {dataLength > 0 && (
            <div className={classes["notification-count"]}>{dataLength}</div>
          )}
        </div>

        <div
          className={classes["notification-container"]}
          ref={this.notificationRef}
          style={{
            ...styles,
            visibility: show ? "visible" : "hidden",
            opacity: show ? 1 : 0
          }}
        >
          <div className={classes["notification-header"]}>
            <div className={classes["header-title"]}>
              {this.props.header.title}
            </div>

            <div
              className={classes["header-option"]}
              onClick={this.props.header.option.onClick}
            >
              {this.props.header.option.name}
            </div>
          </div>

          <div className={classes["notification-items"]} ref={this.scrollRef}>
            {dataLength > 0 ? (
              <Fragment>
                {cardList}
                <div className="loader">{loading && <Spinner />}</div>
              </Fragment>
            ) : (
              <div className={classes["empty-notifications"]}>
                <div>No Notifications</div>
              </div>
            )}
          </div>

          {displaySeeAll && (
            <div className={classes["notification-footer"]}>
              <a href={seeAll}>
                <span className={classes["notification-see_all"]}>see all</span>
              </a>
            </div>
          )}
        </div>
      </Fragment>
    );
  }
}

Notifications.defaultProps = {
  data: {},
  displaySeeAll: true,
  CustomComponent: null,
  fasIconClass: "fas fa-bell",
  header: {
    title: "Notifications",
    option: { name: "Mark all as read", onClick: () => {} }
  },
  classNamePrefix: "",
  cardOptions: true
};

Notifications.propTypes = {
  links: PropTypes.objectOf(PropTypes.string)
};

export default Notifications;
