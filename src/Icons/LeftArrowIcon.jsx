export default function LeftArrowIcon({
  className = "",
  fill = "currentColor",
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g fill={fill}>
        <polygon points="4,24 18,12.3 18,35.7" />
        <rect x={15} y={20} width={27} height={8} />
      </g>
    </svg>
  );
}
