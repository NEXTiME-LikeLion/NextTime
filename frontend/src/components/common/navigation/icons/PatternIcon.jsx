function PatternIcon($active) {
  const currentColor = $active ? theme.colors.primary.default : "#68686D";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
    >
      <path
        d="M20.1646 10.9989H16.4983L13.7486 19.2481L8.24916 2.74976L5.49943 10.9989H1.83313"
        stroke="#currentColor"
        stroke-width="1.64983"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
export default PatternIcon;
