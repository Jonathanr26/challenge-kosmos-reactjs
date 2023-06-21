import React, { useRef, useState, useEffect } from "react";
import Moveable from "react-moveable";

const Component = ({
  id,
  top,
  left,
  width,
  height,
  image,
  updateMoveable,
  handleResizeStart,
  setSelected,
  isSelected,
  handleDeleteComponent,
}) => {
  const ref = useRef();
  const parentRef = useRef();

  const [nodoReferencia, setNodoReferencia] = useState({
    top,
    left,
    width,
    height,
    id,
  });

  useEffect(() => {
    parentRef.current = document.getElementById("parent");
  }, []);

  /**
   * Handles the resizing event of a Moveable component.
   * @param {object} e - Resizing event.
   */
  const onResize = (e) => {
    // UPDATE HEIGHT AND WIDTH
    const newWidth = e.width;
    const newHeight = e.height;

    const positionMaxTop = top + newHeight;
    const positionMaxLeft = left + newWidth;

    const parentBounds = parentRef.current.getBoundingClientRect();

    let adjustedWidth = newWidth;
    let adjustedHeight = newHeight;

    let translateXAdjusted;
    let translateYAdjusted;

    if (positionMaxTop > parentBounds.height) {
      adjustedHeight = parentBounds.height - top;
    }
    if (positionMaxLeft > parentBounds.width) {
      adjustedWidth = parentBounds.width - left;
    }

    const beforeTranslate = e.drag.beforeTranslate;
    const translateX = beforeTranslate[0];
    const translateY = beforeTranslate[1];

    let adjustedTop = Math.max(top + translateY, 0);
    let adjustedLeft = Math.max(left + translateX, 0);

    if (adjustedTop < 0) {
      adjustedTop = 0;
      translateYAdjusted = translateY - translateY;
    }
    if (adjustedLeft < 0) {
      adjustedLeft = 0;
      translateXAdjusted = translateX - translateX;
    }

    const prevWidth = ref.current.offsetWidth;
    const prevHeight = ref.current.offsetHeight;
    const widthRatio = adjustedWidth / prevWidth;
    const heightRatio = adjustedHeight / prevHeight;
    translateXAdjusted = translateX * widthRatio;
    translateYAdjusted = translateY * heightRatio;

    updateMoveable(id, {
      top: adjustedTop,
      left: adjustedLeft,
      width: adjustedWidth,
      height: adjustedHeight,
      image,
    });

    ref.current.style.width = `${adjustedWidth}px`;
    ref.current.style.height = `${adjustedHeight}px`;
    ref.current.style.transform = `translate(${translateXAdjusted}px, ${translateYAdjusted}px)`;

    setNodoReferencia({
      ...nodoReferencia,
      translateX: translateXAdjusted,
      translateY: translateYAdjusted,
      top: adjustedTop,
      left: adjustedLeft,
    });
  };

  /**
   * Handles the resizing completion event of a Moveable component.
   * @param {object} e - Resizing event completed.
   */
  const onResizeEnd = (e) => {
    const newWidth = e.lastEvent?.width;
    const newHeight = e.lastEvent?.height;

    const positionMaxTop = top + newHeight;
    const positionMaxLeft = left + newWidth;

    const parentBounds = parentRef.current.getBoundingClientRect();

    let adjustedWidth = newWidth;
    let adjustedHeight = newHeight;

    if (positionMaxTop > parentBounds.height) {
      adjustedHeight = parentBounds.height - top;
    }
    if (positionMaxLeft > parentBounds.width) {
      adjustedWidth = parentBounds.width - left;
    }

    const { lastEvent } = e;
    const { drag } = lastEvent;
    const { beforeTranslate } = drag;

    const absoluteTop = top + beforeTranslate[1];
    const absoluteLeft = left + beforeTranslate[0];

    updateMoveable(id, {
      top: absoluteTop,
      left: absoluteLeft,
      width: adjustedWidth,
      height: adjustedHeight,
      image,
    }, true);
  };

  return (
    <>
      <div
        ref={ref}
        className={`draggable ${isSelected ? "selected" : ""}`}
        style={{
          position: "absolute",
          top: top,
          left: left,
          width: width,
          height: height,
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
        }}
        onClick={() => setSelected(id)}
      >
        {isSelected && (
          <button className="delete-button" onClick={() => handleDeleteComponent(id)}>
            X
          </button>
        )}
      </div>

      <Moveable
        target={isSelected && ref.current}
        resizable
        draggable
        onDrag={(e) => {
          updateMoveable(id, {
            top: e.top,
            left: e.left,
            width,
            height,
            image,
          });
        }}
        onResizeStart={(e) => handleResizeStart(id, e)}
        onResize={onResize}
        onResizeEnd={onResizeEnd}
        keepRatio={false}
        throttleResize={1}
        renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
        edge={false}
        zoom={1}
        origin={false}
        padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
      />
    </>
  );
};

export default Component;
