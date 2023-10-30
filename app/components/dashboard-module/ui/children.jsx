export const Children = ({ surveys, onSelect }) => {
  return (
    <div className="flex flex-col mt-96">
      {surveys.map((child) => (
        <button key={child.id} onClick={() => onSelect(child)}>
          {child.name}
        </button>
      ))}
    </div>
  );
};
