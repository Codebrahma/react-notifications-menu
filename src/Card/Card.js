import React from "react";
import classes from "./Card.css";

const Card = props => {
  const { image, message, receivedTime, imagePosition } = props;

  const renderImage = props.hasOwnProperty("renderImage")
    ? props.renderImage
    : true;

  const style =
    imagePosition === "right" ? { flexDirection: "row-reverse" } : null;
  return (
    <div className={classes.card}>
      <div className={classes.content} style={style}>
        {renderImage ? (
          <div className={classes.image}>
            <img src={image} alt="Person " />
          </div>
        ) : null}
        <div className={classes.message}>
          <div className={classes.text}>{message}</div>
          <div className={classes.time}>{receivedTime}</div>
        </div>
      </div>
      <div className={classes.options}>
        <div className={classes.option}>&hellip;</div>
        <div className={classes.option} title="Mark as Read">
          &bull;
        </div>
      </div>
    </div>
  );
};

export default Card;
