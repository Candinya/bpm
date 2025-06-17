const IconGooeyAnim = (props: any) => {
  const css = `.nc-loop-gooey-48-icon-f{--animation-duration:1s}.nc-loop-gooey-48-icon-f :first-child{transform-origin:7px 24px;animation:nc-loop-gooey-48-anim var(--animation-duration) infinite}@keyframes nc-loop-gooey-48-anim{from{transform:translateX(0)}to{transform:translateX(34px)}}`;

  return (
    <svg
      height="48"
      width="48"
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g>
        <defs />
        <g className="nc-loop-gooey-48-icon-f">
          <circle cx="7" cy="24" r="6" />
          <circle cx="7" cy="24" r="6" />
          <circle cx="24" cy="24" r="6" />
          <circle cx="41" cy="24" r="6" />
        </g>
        <style>{css}</style>
      </g>
    </svg>
  );
};

export default IconGooeyAnim;
