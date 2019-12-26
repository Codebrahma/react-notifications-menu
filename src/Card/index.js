// eslint-disable-next-line jsx-a11y/label-has-associated-control
import React from 'react';
import PropTypes from 'prop-types';
import './card.scss';

const Card = ({
  imagePosition,
  classNamePrefix,
  cardOptions,
  renderImage,
  markAsRead, data,
}) => {
  const {
    image, message, receivedTime, detailPage,
  } = data;


  const classNameGenerator = () => {
    const prefix = classNamePrefix ? `${classNamePrefix}-` : '';
    const classes = {
      card: `${prefix}card`,
      content: `${prefix}content`,
      image: `${prefix}image`,
      options: `${prefix}options`,
      option: `${prefix}option`,
      message: `${prefix}message`,
      text: `${prefix}text`,
      time: `${prefix}time`,
    };
    return classes;
  };

  const classes = classNameGenerator();

  return (
    <div className={classes.card}>
      <a href={detailPage}>
        <div
          className={classes.content}
          style={
            imagePosition === 'right' ? { flexDirection: 'row-reverse' } : {}
          }
        >
          {renderImage && (
            <div className={classes.image}>
              <img src={image} alt="Person " />
            </div>
          )}
          <div className={classes.message}>
            <div className={classes.text}>{message}</div>
            {receivedTime && <div className={classes.time}>{receivedTime}</div>}
          </div>
        </div>
      </a>
      <div className={classes.options}>
        {cardOptions && (
        <div className={classes.option}>{cardOptions.option1}</div>
        )}
        {
          markAsRead && (<div
            className={classes.option}
            title="Mark as Read"
            onClick={() => markAsRead(data)}
          >
            {cardOptions.option2}
          </div>)
        }
        
      </div>
    </div>
  );
};

Card.defaultProps = {
  renderImage: true,
  imagePosition: 'left',
  cardOptions: null,
  markAsRead: null,
  data: null,
  classNamePrefix: null,
};

Card.propTypes = {
  data: PropTypes.shape({
    image: PropTypes.string,
    message: PropTypes.any,
    receivedTime: PropTypes.string,
    detailPage: PropTypes.string,
  }),
  renderImage: PropTypes.bool,
  markAsRead: PropTypes.func,
  cardOptions: PropTypes.shape({
    option1: PropTypes.func,
    option2: PropTypes.func,
  }),
  imagePosition: PropTypes.string,
  classNamePrefix: PropTypes.string,
};
export default Card;
