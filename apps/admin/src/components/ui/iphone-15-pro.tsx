import type { SVGProps } from "react"

export interface Iphone15ProProps extends SVGProps<SVGSVGElement> {
  width?: number
  height?: number
  imageSrc?: string
  videoSrc?: string
  id?: string
}

export function Iphone15Pro({
  width = 433,
  height = 882,
  imageSrc,
  videoSrc,
  id = "iphone-15-pro",
  ...props
}: Iphone15ProProps) {
  const roundedCornersClipId = id + "-rounded-corners"

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      id={id}
      {...props}
    >
      <path
        d="M2 73C2 32.68 34.68 0 75 0H357C397.32 0 430 32.68 430 73V809C430 849.32 397.32 882 357 882H75C34.68 882 2 849.32 2 809V73Z"
        className="fill-muted"
      />
      <path
        d="M0 171C0 170.45 0.45 170 1 170H3V204H1C0.45 204 0 203.55 0 203V171Z"
        className="fill-muted"
      />
      <path
        d="M1 234C1 233.45 1.45 233 2 233H3.5V300H2C1.45 300 1 299.55 1 299V234Z"
        className="fill-muted"
      />
      <path
        d="M1 319C1 318.45 1.45 318 2 318H3.5V385H2C1.45 385 1 384.55 1 384V319Z"
        className="fill-muted"
      />
      <path
        d="M430 279H432C432.55 279 433 279.45 433 280V384C433 384.55 432.55 385 432 385H430V279Z"
        className="fill-muted"
      />
      <path
        d="M6 74C6 35.34 35.34 4 76 4H356C394.66 4 426 35.34 426 74V808C426 846.66 394.66 878 356 878H76C35.34 878 6 846.66 6 808V74Z"
        className="fill-background"
      />
      <path
        opacity="0.5"
        d="M174 5H258V5.5C258 6.6 257.11 7.5 256 7.5H176C174.9 7.5 174 6.6 174 5.5V5Z"
        className="fill-muted"
      />
      <path
        d="M21.25 75C21.25 44.21 44.21 19.25 77 19.25H355C385.79 19.25 410.75 44.21 410.75 75V807C410.75 837.79 385.79 862.75 355 862.75H77C44.21 862.75 21.25 837.79 21.25 807V75Z"
        className="fill-muted stroke-muted stroke-[0.5]"
      />

      {imageSrc && (
        <image
          href={imageSrc}
          x="21.25"
          y="19.25"
          width="389.5"
          height="843.5"
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#${roundedCornersClipId})`}
        />
      )}
      {videoSrc && (
        <foreignObject x="21.25" y="19.25" width="389.5" height="843.5">
          <video
            className="size-full overflow-hidden rounded-[55.75px] object-cover"
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
          />
        </foreignObject>
      )}
      <path
        d="M154 48.5C154 38.28 162.28 30 172.5 30H259.5C269.72 30 278 38.28 278 48.5C278 58.72 269.72 67 259.5 67H172.5C162.28 67 154 58.72 154 48.5Z"
        className="fill-muted"
      />
      <path
        d="M249 48.5C249 42.7 253.7 38 259.5 38C265.3 38 270 42.7 270 48.5C270 54.3 265.3 59 259.5 59C253.7 59 249 54.3 249 48.5Z"
        className="fill-muted"
      />
      <path
        d="M254 48.5C254 45.46 256.46 43 259.5 43C262.54 43 265 45.46 265 48.5C265 51.54 262.54 54 259.5 54C256.46 54 254 51.54 254 48.5Z"
        className="fill-background"
      />
      <defs>
        <clipPath id={roundedCornersClipId}>
          <rect
            x="21.25"
            y="19.25"
            width="389.5"
            height="843.5"
            rx="55.75"
            ry="55.75"
          />
        </clipPath>
      </defs>
    </svg>
  )
}
