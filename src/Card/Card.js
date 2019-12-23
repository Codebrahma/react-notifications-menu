import React from "react";
import "./Card.scss";

const Card = props => {
  const {
    image,
    message,
    receivedTime,
    imagePosition,
    classNamePrefix,
    detailPage,
    cardOptions,
    renderImage
  } = props;

  const classNameGenerator = () => {
    const prefix = classNamePrefix ? `${classNamePrefix}-` : "";
    const classes = {
      card: `${prefix}card`,
      content: `${prefix}content`,
      image: `${prefix}image`,
      options: `${prefix}options`,
      option: `${prefix}option`,
      message: `${prefix}message`,
      text: `${prefix}text`,
      time: `${prefix}time`
    };
    return classes;
  };

  const classes = classNameGenerator();

  return (
    <a href={detailPage}>
      <div className={classes.card}>
        <div
          className={classes.content}
          style={
            imagePosition === "right" ? { flexDirection: "row-reverse" } : {}
          }
        >
          {renderImage ? (
            <div className={classes.image}>
              <img src={image} alt="Person " />
            </div>
          ) : null}
          <div className={classes.message}>
            <div className={classes.text}>{message}</div>
            {receivedTime && <div className={classes.time}>{receivedTime}</div>}
          </div>
        </div>
        {cardOptions && (
          <div className={classes.options}>
            <div className={classes.options}>&hellip;</div>
            <div className={classes.option} title="Mark as Read">
              &bull;
            </div>
          </div>
        )}
      </div>
    </a>
  );
};

Card.defaultProps = {
  renderImage: true,
  imagePosition: "left"
};
export default Card;
