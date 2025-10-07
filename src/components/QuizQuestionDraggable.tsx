import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

export function QuizQuestionDraggable({ question, idx, children }) {
    return (
        <Draggable draggableId={`question-${idx}`} index={idx}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    {children}
                </div>
            )}
        </Draggable>
    );
}
