import React from "react";
import "./Card.css";

const Card = props => {
  const {
    image,
    message,
    receivedTime,
    imagePosition,
    classNamePrefix,
    detailPage,
    cardOptions
  } = props;

  const renderImage = props.hasOwnProperty("renderImage")
    ? props.renderImage
    : true;

  const style =
    imagePosition === "right" ? { flexDirection: "row-reverse" } : null;
  return (
    <a href={detailPage}>
      <div className={`${classNamePrefix}card`}>
        <div className={`${classNamePrefix}content`} style={style}>
          {renderImage ? (
            <div className={`${classNamePrefix}image`}>
              <img src={image} alt="Person " />
            </div>
          ) : null}
          <div className={`${classNamePrefix}message`}>
            <div className="text">{message}</div>
            {receivedTime && <div className="time">{receivedTime}</div>}
          </div>
        </div>
        {cardOptions && (
          <div className={`${classNamePrefix}options`}>
            <div className={`${classNamePrefix}option`}>&hellip;</div>
            <div className={`${classNamePrefix}option`} title="Mark as Read">
              &bull;
            </div>
          </div>
        )}
      </div>
    </a>
  );
};

export default Card;
