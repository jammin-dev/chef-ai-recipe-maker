import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const DragAndDropList = ({ items, setItems, renderItem }) => {
  // Handle reordering of the list
  const handleOnDragEnd = (result) => {
    if (!result.destination) return; // If dropped outside the list, do nothing

    const updatedItems = Array.from(items);
    const [movedItem] = updatedItems.splice(result.source.index, 1);
    updatedItems.splice(result.destination.index, 0, movedItem);
    const reorderedItems = updatedItems.map((item, index) => ({
      ...item,
      index: (index + 1).toString(), // Convert index to a 1-based step
    }));
    setItems(reorderedItems);
  };
  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="droppable-list">
        {(provided) => (
          <ul
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex flex-col gap-2"
          >
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided) => (
                  <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...provided.draggableProps.style,
                      // padding: "10px 20px",
                      // margin: "0 0 10px 0",
                      // backgroundColor: "#f4f4f4",
                      // border: "1px solid #ddd",
                      // borderRadius: "4px",
                      // textAlign: "center",
                    }}
                  >
                    {renderItem(item, index)}
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DragAndDropList;
