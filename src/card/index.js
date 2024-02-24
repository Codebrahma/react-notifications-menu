import React from 'react';
import PropTypes from 'prop-types';
import './card.scss';

const Card = ({
  imagePosition,
  classNamePrefix,
  cardOption,
  renderImage,
  data,
  hasRead,
}) => {
  const { image, message, receivedTime, detailPage } = data;

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
      hasRead: `${prefix}card-has-read`,
    };
    return classes;
  };

  const classes = classNameGenerator();

  return (
    <div className={`${classes.card} ${hasRead ? classes.hasRead : ''}`}>
      <a href={detailPage} className="card-link">
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
        {cardOption && (
          <div className={classes.option} onClick={() => cardOption(data)}>
            &hellip;
          </div>
        )}
      </div>
    </div>
  );
};

Card.defaultProps = {
  renderImage: true,
  imagePosition: 'left',
  data: null,
  classNamePrefix: null,
  cardOption: null,
  hasRead: false,
};

Card.propTypes = {
  data: PropTypes.shape({
    image: PropTypes.string,
    message: PropTypes.any,
    receivedTime: PropTypes.string,
    detailPage: PropTypes.string,
  }),
  renderImage: PropTypes.bool,
  cardOption: PropTypes.func,
  imagePosition: PropTypes.oneOf(['left', 'right']),
  classNamePrefix: PropTypes.string,
  hasRead: PropTypes.bool,
};

export default Card;
