import React, { useState } from "react";
import Component from "./components/Component";

const App = () => {
  const [moveableComponents, setMoveableComponents] = useState([]);
  const [selected, setSelected] = useState(null);

  /**
   * Adds a new Moveable component with a random image obtained from an API.
   */
  const addMoveable = async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/photos");
    const data = await response.json();

    const randomImage = data[Math.floor(Math.random() * data.length)].thumbnailUrl;

    setMoveableComponents((prevComponents) => [
      ...prevComponents,
      {
        id: Math.floor(Math.random() * Date.now()),
        top: 0,
        left: 0,
        width: 100,
        height: 100,
        image: randomImage,
        updateEnd: true,
      },
    ]);
  };

  /**
   * Updates the properties of a specific Moveable component.
   * @param {number} id - ID of the Moveable component.
   * @param {object} newComponent - New object with updated properties.
   * @param {boolean} updateEnd - Indicates whether the update is at the end of an action.
   */
  const updateMoveable = (id, newComponent, updateEnd = false) => {
    const updatedMoveables = moveableComponents.map((moveable) => {
      if (moveable.id === id) {
        return { id, ...newComponent, updateEnd };
      }
      return moveable;
    });
    setMoveableComponents(updatedMoveables);
  };

  /**
   * Handles the resizing start event of a Moveable component.
   * @param {number} id - ID of the Moveable component.
   * @param {object} e - Resizing event.
   */
  const handleResizeStart = (id, e) => {
    const { direction } = e;
    const [handlePosX, handlePosY] = direction;

    if (handlePosX === -1 || handlePosY === -1) {
      const moveableComponent = moveableComponents.find((component) => component.id === id);

      if (moveableComponent) {
        const { left, width } = moveableComponent;
      // Save the initial left and width values of the moveable component
        moveableComponent.initialLeft = left;
        moveableComponent.initialWidth = width;
      }
    }
  };

  /**
   * Removes a Moveable component.
   * @param {number} id - ID of the Moveable component to be removed.
   */
  const handleDeleteComponent = (id) => {
    setMoveableComponents((prevComponents) => prevComponents.filter((component) => component.id !== id));
  };

  return (
    <main className="main">
      <button className="button" onClick={addMoveable}>
        Add Moveable
      </button>
      <div id="parent" className="component_container">
        {moveableComponents.map((item, index) => (
          <Component
            key={index}
            {...item}
            updateMoveable={updateMoveable}
            handleResizeStart={handleResizeStart}
            setSelected={setSelected}
            isSelected={selected === item.id}
            handleDeleteComponent={handleDeleteComponent}
          />
        ))}
      </div>
    </main>
  );
};

export default App;
