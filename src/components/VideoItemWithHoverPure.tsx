import { PureComponent, ForwardedRef, forwardRef } from "react";

type VideoItemWithHoverPureType = {
  src: string;
  innerRef: ForwardedRef<HTMLDivElement>;
  handleHover: (value: boolean) => void;
  aspectRatio?: string; // Nuevo
};

class VideoItemWithHoverPure extends PureComponent<VideoItemWithHoverPureType> {
  render() {
    const { aspectRatio = "calc(9 / 16 * 100%)" } = this.props;
    return (
      <div
        ref={this.props.innerRef}
        style={{
          zIndex: 9,
          cursor: "pointer",
          borderRadius: 0.5,
          width: "100%",
          position: "relative",
          // Usa aspectRatio si es string tipo "2 / 3", si no usa paddingTop
          ...(aspectRatio.includes("/") 
            ? { aspectRatio }
            : { paddingTop: aspectRatio }),
        }}
      >
        <img
          src={this.props.src}
          alt={this.props.src}
          style={{
            top: 0,
            height: "100%",
            objectFit: "cover",
            position: "absolute",
            borderRadius: "4px",
            width: "100%",
            display: "block",
          }}
          onPointerEnter={() => this.props.handleHover(true)}
          onPointerLeave={() => this.props.handleHover(false)}
        />
      </div>
    );
  }
}

const VideoItemWithHoverRef = forwardRef<
  HTMLDivElement,
  Omit<VideoItemWithHoverPureType, "innerRef">
>((props, ref) => <VideoItemWithHoverPure {...props} innerRef={ref} />);
VideoItemWithHoverRef.displayName = "VideoItemWithHoverRef";

export default VideoItemWithHoverRef;
