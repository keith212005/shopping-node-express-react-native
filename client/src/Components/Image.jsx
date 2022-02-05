export const Image = (props) => {
  return (
    <img
      alt={{}}
      src={props.source}
      style={{ aspectRatio: 1, width: props.size ?? 100 }}
    />
  );
};
