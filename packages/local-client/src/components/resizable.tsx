import "./resizable.css";
import { useEffect, useState } from "react";
import { ResizableBox, ResizableBoxProps } from "react-resizable";

interface ResizableProps {
  direction: "horizontal" | "vertical";
}

const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  let resizableProps: ResizableBoxProps;
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  const [width, setWidth] = useState(window.innerWidth * 0.75);

  useEffect(() => {
    let timer: any;
    const listner = () => {
      if (timer) clearTimeout(timer);
      setTimeout(() => {
        setInnerHeight(window.innerHeight);
        setInnerWidth(window.innerWidth);
        if (window.innerWidth * 0.75 < width) {
          setWidth(window.innerWidth * 0.75);
        }
      }, 1000);
    };
    window.addEventListener("resize", listner);
    return () => {
      window.removeEventListener("resize", listner);
    };
  }, [width]);

  if (direction === "horizontal") {
    resizableProps = {
      className: "resize-horizontal",
      width,
      height: Infinity,
      minConstraints: [innerWidth * 0.2, Infinity],
      maxConstraints: [innerWidth * 0.75, Infinity],
      resizeHandles: ["e"],
      onResizeStop: (e, data) => {
        setWidth(data.size.width);
      },
    };
  } else {
    resizableProps = {
      width: Infinity,
      height: 300,
      minConstraints: [Infinity, 24],
      maxConstraints: [Infinity, innerHeight * 0.9],
      resizeHandles: ["s"],
    };
  }
  return <ResizableBox {...resizableProps}>{children}</ResizableBox>;
};

export default Resizable;
