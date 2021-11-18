import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Card from "./card";
import Spinner from "./spinner";
import defaultIcon from "./assets/default_bell.svg";
import "./styles.scss";

class Notifications extends Component {
  constructor(props) {
    super(props);

    const { data, style } = this.props;

    this.state = {
      show: false,
      loading: false,
      data,
      styles: style || {},
      classes: this.classNameGenerator(),
      notificationCount: data.length || 0,
    };

    this.scrollRef = React.createRef();
    this.notificationRef = React.createRef();
    this.containerRef = React.createRef();
  }

  componentDidMount() {
    const notificationRef = this.notificationRef.current;
    const scrollRef = this.scrollRef.current;
    const { data, styles } = this.state;
    const { fetchData } = this.props;

    document.addEventListener("mousedown", (event) => {
      this.handleClickOutside(event);
    });

    // If data is a URL
    if (typeof data === "string" && this.validateURL(data)) {
      axios
        .get(data)
        .then((response) => this.setState({ data: response.data }))
        .catch((err) => {
          throw new Error(err);
        });
    }

    // To make notification container to adjust based on window, if it is placed on right side
    if (notificationRef.offsetLeft > notificationRef.offsetWidth) {
      this.setState({
        styles: {
          ...styles,
          transform: `translateX(-${notificationRef.offsetWidth - 20}px)`,
        },
      });
    }

    if (fetchData) {
      // Infinite scroll to notification container
      if (data.length > 0) {
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
  }

  static getDerivedStateFromProps(props, state) {
    if (props.data !== state.data) {
      const diff = props.data.length - state.data.length;
      return { data: props.data, notificationCount: diff };
    }
    return state;
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", (event) => {
      this.handleClickOutside(event);
    });
  }

  handleClickOutside = (event) => {
    if (this.containerRef && this.containerRef.current) {
      if (!this.containerRef.current.contains(event.target)) {
        this.setState({ show: false });
      }
    }
  };

  validateURL = (myURL) => {
    const pattern = new RegExp(
      "^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$",
      "i"
    );
    return pattern.test(myURL);
  };

  fetchData = () => {
    const { fetchData } = this.props;
    const { data } = this.state;
    this.setState({ loading: true }, () => {
      const fetchedData = fetchData();
      this.setState({ loading: false, data: [...data, ...fetchedData] });
    });
  };

  classNameGenerator = () => {
    const { classNamePrefix } = this.props;
    const prefix = classNamePrefix ? `${classNamePrefix}-` : "";
    const classes = {
      notifications: `${prefix}notifications`,
      icon: `${prefix}icon`,
      image: `${prefix}image`,
      count: `${prefix}count`,
      container: `${prefix}container`,
      header: `${prefix}header`,
      headerTitle: `${prefix}header-title`,
      headerOption: `${prefix}header-option`,
      items: `${prefix}items`,
      emptyNotifications: `${prefix}empty-notifications`,
      footer: `${prefix}footer`,
      seeAll: `${prefix}see-all`,
    };
    return classes;
  };

  render() {
    const { show, styles, loading, data, classes, notificationCount } =
      this.state;
    const {
      viewAllBtn,
      icon,
      height,
      width,
      headerBackgroundColor,
      header,
      notificationCard,
    } = this.props;

    const { title, option } = header;
    const CustomComponent = notificationCard;
    const dataLength = data.length;

    const cardList =
      Array.isArray(data) &&
      (CustomComponent
        ? data.map((item) => (
            <CustomComponent key={item.message} {...this.props} data={item} />
          ))
        : data.map((item) => (
            <Card key={item.message} {...this.props} data={item} />
          )));

    return (
      <div className={classes.notifications} ref={this.containerRef}>
        <div
          className={classes.icon}
          onClick={() => this.setState({ show: !show, notificationCount: 0 })}
        >
          <img
            src={icon || defaultIcon}
            alt="notify"
            className={classes.image}
          />
          {notificationCount > 0 && (
            <div
              className={classes.count}
              style={notificationCount >= 100 ? { fontSize: "8px" } : null}
            >
              {notificationCount < 100 ? notificationCount : "99+"}
            </div>
          )}
        </div>

        <div
          className={classes.container}
          ref={this.notificationRef}
          style={{
            ...styles,
            width,
            visibility: show ? "visible" : "hidden",
            opacity: show ? 1 : 0,
          }}
        >
          <div
            className={classes.header}
            style={{ backgroundColor: headerBackgroundColor }}
          >
            <div className={classes.headerTitle}>{title}</div>

            {dataLength > 0 && (
              <div className={classes.headerOption} onClick={option.onClick}>
                {option.text}
              </div>
            )}
          </div>

          <div
            className={classes.items}
            style={{ height }}
            ref={this.scrollRef}
          >
            {dataLength > 0 ? (
              <Fragment>
                {cardList}
                <div className="loader">{loading && <Spinner />}</div>
              </Fragment>
            ) : (
              <div className={classes.emptyNotifications}>
                <div>No Notifications</div>
              </div>
            )}
          </div>

          {viewAllBtn && (
            <div className={classes.footer}>
              <a href={viewAllBtn.linkTo}>
                <span className={classes.seeAll}>{viewAllBtn.text}</span>
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }
}

Notifications.defaultProps = {
  data: [],
  viewAllBtn: null,
  notificationCard: null,
  fetchData: null,
  height: null,
  width: null,
  header: {
    title: "Notifications",
    option: { text: "Mark all as read", onClick: () => {} },
  },
  headerBackgroundColor: null,
  classNamePrefix: "",
  icon: defaultIcon,
  style: {},
};

Notifications.propTypes = {
  data: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  notificationCard: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.instanceOf(React.Component),
  ]),
  fetchData: PropTypes.func,
  header: PropTypes.shape({
    title: PropTypes.string,
    option: PropTypes.shape({
      text: PropTypes.string,
      onClick: PropTypes.func,
    }),
  }),
  viewAllBtn: PropTypes.shape({
    text: PropTypes.string,
    linkTo: PropTypes.string,
  }),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  headerBackgroundColor: PropTypes.string,
  classNamePrefix: PropTypes.string,
  icon: PropTypes.string,
  style: PropTypes.shape({}),
};

export default Notifications;
