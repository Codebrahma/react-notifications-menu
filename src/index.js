import React, { Component, Fragment } from 'react';
import Card from './Card';
import PropTypes from 'prop-types';
import Spinner from './Spinner';
import defaultIcon from './assets/default_bell.svg';
import './styles.scss';

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
    this.containerRef = React.createRef();
  }

  componentDidMount() {
    const notificationRef = this.notificationRef.current;
    const scrollRef = this.scrollRef.current;
    const data = this.props.data;

    document.addEventListener('mousedown', (event) =>
      this.handleClickOutside(event)
    );

    // If data is a URL
    if (typeof data === 'string' && this.validateURL(data)) {
      fetch(this.state.data)
        .then((response) => response.json())
        .then((data) => this.setState({ data }))
        .catch((err) => console.log(err));
    }

    // To make notification container to adjust based on window, if it is placed on right side
    if (notificationRef.offsetLeft > notificationRef.offsetWidth) {
      this.setState({
        styles: {
          ...this.state.styles,
          transform: `translateX(-${notificationRef.offsetWidth - 20}px)`
        }
      });
    }

    if (this.props.fetchData) {
      // Infinite scroll to notification container
      if (Object.keys(this.state.data).length > 0) {
        scrollRef.addEventListener('scroll', () => {
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

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    if (
      this.containerRef &&
      !this.containerRef.current.contains(event.target)
    ) {
      this.setState({ show: false });
    }
  };

  validateURL = (myURL) => {
    const pattern = new RegExp(
      '^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+ \
      [a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)* \
      (\\?[;&amp;a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$',
      'i'
    );
    return pattern.test(myURL);
  };

  fetchData = () => {
    this.setState({ loading: true }, () => {
      const fetchedData = this.props.fetchData();
      this.setState({ loading: false, data: [...data, ...fetchedData] });
    });
  };

  classNameGenerator = () => {
    const prefix = this.props.classNamePrefix
      ? `${this.props.classNamePrefix}-`
      : '';
    const classes = {
      notifications: `${prefix}notifications`,
      icon: `${prefix}icon`,
      count: `${prefix}count`,
      container: `${prefix}container`,
      header: `${prefix}header`,
      headerTitle: `${prefix}header-title`,
      headerOption: `${prefix}header-option`,
      items: `${prefix}items`,
      emptyNotifications: `${prefix}empty-notifications`,
      footer: `${prefix}footer`,
      seeAll: `${prefix}see-all`
    };
    return classes;
  };

  render() {
    const { show, styles, loading, data, classes } = this.state;
    const {
      viewAllBtn,
      icon,
      height,
      width,
      headerBackgroundColor
    } = this.props;
    const { title, option } = this.props.header;
    const CustomComponent = this.props.notificationCard;
    const dataLength = data.length;

    const cardList = CustomComponent
      ? data.map((item, index) => (
          <CustomComponent key={index} {...this.props} data={item} />
        ))
      : data.map((item, index) => (
          <Card key={index} {...this.props} data={item} />
        ));

    return (
      <div className={classes.notifications} ref={this.containerRef}>
        <div
          className={classes.icon}
          onClick={() => this.setState({ show: !show })}
        >
          <img src={icon || defaultIcon} alt='notify' />
          {dataLength > 0 && (
            <div
              className={classes.count}
              style={dataLength >= 100 ? { fontSize: '8px' } : null}
            >
              {dataLength < 100 ? dataLength : '99+'}
            </div>
          )}
        </div>

        <div
          className={classes.container}
          ref={this.notificationRef}
          style={{
            ...styles,
            width,
            visibility: show ? 'visible' : 'hidden',
            opacity: show ? 1 : 0
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
                <div className='loader'>{loading && <Spinner />}</div>
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
    title: 'Notifications',
    option: { text: 'Mark all as read', onClick: () => {} }
  },
  headerBackgroundColor: null
};

Notifications.propTypes = {
  data: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  notificationCard: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.instanceOf(React.Component)
  ]),
  fetchData: PropTypes.func,
  header: PropTypes.shape({
    title: PropTypes.string,
    option: PropTypes.shape({ text: PropTypes.string, onClick: PropTypes.func })
  }),
  viewAllBtn: PropTypes.shape({
    text: PropTypes.string,
    linkTo: PropTypes.string
  }),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  headerBackgroundColor: PropTypes.string
};

export default Notifications;
