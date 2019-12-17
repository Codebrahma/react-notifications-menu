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
      <div className={classNamePrefix ? `${classNamePrefix}-card` : "card"}>
        <div
          className={classNamePrefix ? `${classNamePrefix}-content` : "content"}
          style={style}
        >
          {renderImage ? (
            <div
              className={classNamePrefix ? `${classNamePrefix}-image` : "image"}
            >
              <img src={image} alt="Person " />
            </div>
          ) : null}
          <div
            className={
              classNamePrefix ? `${classNamePrefix}-message` : "message"
            }
          >
            <div
              className={classNamePrefix ? `${classNamePrefix}-text` : "text"}
            >
              {message}
            </div>
            {receivedTime && <div className="time">{receivedTime}</div>}
          </div>
        </div>
        {cardOptions && (
          <div
            className={
              classNamePrefix ? `${classNamePrefix}-options` : "options"
            }
          >
            <div
              className={
                classNamePrefix ? `${classNamePrefix}-option` : "option"
              }
            >
              &hellip;
            </div>
            <div
              className={
                classNamePrefix ? `${classNamePrefix}-option` : "option"
              }
              title="Mark as Read"
            >
              &bull;
            </div>
          </div>
        )}
      </div>
    </a>
  );
};

export default Card;
