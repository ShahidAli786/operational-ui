import { compact, defaults, difference, find, forEach, get, map, sortBy } from "lodash/fp"
import Series from "../series"
import {
  area as d3Area,
  curveCardinal,
  curveLinear,
  curveMonotoneX,
  curveMonotoneY,
  curveStep,
  curveStepAfter,
  curveStepBefore,
} from "d3-shape"
import * as styles from "./styles"
import {
  AreaRendererAccessors,
  AxesData,
  AxisPosition,
  AxisType,
  D3Selection,
  Datum,
  EventBus,
  Object,
  Partial,
  RendererAccessor,
  RendererClass,
  RendererType,
  SingleRendererOptions,
  State,
} from "../../typings"

export type Options = SingleRendererOptions<AreaRendererAccessors>

const interpolator = {
  cardinal: curveCardinal,
  linear: curveLinear,
  monotoneX: curveMonotoneX,
  monotoneY: curveMonotoneY,
  step: curveStep,
  stepAfter: curveStepAfter,
  stepBefore: curveStepBefore,
}

const defaultAccessors: Partial<AreaRendererAccessors> = {
  color: (series: Series, d: Datum) => series.legendColor(),
  interpolate: (series: Series, d: Datum) => "linear",
  closeGaps: (series: Series, d: Datum) => true,
}

const hasValue = (d: any): boolean => {
  return !!d || d === 0
}

const aOrB = (a: any, b: any): any => {
  return hasValue(a) ? a : b
}

class Area implements RendererClass<AreaRendererAccessors> {
  closeGaps: RendererAccessor<boolean>
  color: RendererAccessor<string>
  data: Datum[]
  el: D3Selection
  events: EventBus
  interpolate: RendererAccessor<any>
  options: Options
  series: Series
  state: State
  type: RendererType = "area"
  xIsBaseline: boolean
  x: RendererAccessor<number | Date>
  x0: RendererAccessor<number>
  x1: RendererAccessor<number>
  xScale: any
  y: RendererAccessor<number | Date>
  y0: RendererAccessor<number>
  y1: RendererAccessor<number>
  yScale: any

  constructor(state: State, events: EventBus, el: D3Selection, data: Datum[], options: Options, series: Series) {
    this.state = state
    this.events = events
    this.series = series
    this.el = this.appendSeriesGroup(el)
    this.update(data, options)
  }

  // Public methods
  update(data: Datum[], options: Options): void {
    this.options = options
    this.assignAccessors(options.accessors)
    this.data = data
  }

  draw(): void {
    this.setAxisScales()
    this.addMissingData()
    this.updateClipPath()

    const duration: number = this.state.current.get("config").duration
    const data: Datum[] = sortBy((d: Datum): any => (this.xIsBaseline ? this.x(d) : this.y(d)))(this.data)
    const area = this.el.selectAll("path.main").data([data])

    area
      .enter()
      .append("svg:path")
      .attr("class", "main")
      .attr("d", this.startPath.bind(this))
      .merge(area)
      .attr("fill", this.color.bind(this))
      .transition()
      .duration(duration)
      .attr("d", this.path.bind(this))
      .attr("clip-path", `url(#area-clip-${this.series.key()}`)

    area
      .exit()
      .transition()
      .duration(duration)
      .attr("d", this.startPath.bind(this))
      .remove()
  }

  close(): void {
    this.el.remove()
  }

  dataForAxis(axis: "x" | "y"): any[] {
    const data: any[] = map((this as any)[axis])(this.data)
      .concat(map(get(`${axis}0`))(this.data))
      .concat(map(get(`${axis}1`))(this.data))
    return compact(data)
  }

  // Private methods
  private appendSeriesGroup(el: D3Selection): D3Selection {
    return el.append("g").attr("class", `series:${this.series.key()} ${styles.area}`)
  }

  private setAxisScales(): void {
    this.xIsBaseline = this.state.current.get("computed").axes.baseline === "x"
    this.xScale = this.state.current.get("computed").axes.computed[this.series.xAxis()].scale
    this.yScale = this.state.current.get("computed").axes.computed[this.series.yAxis()].scale
    this.x0 = (d: Datum): any => this.xScale(this.xIsBaseline ? this.x(d) : aOrB(d.x0, 0))
    this.x1 = (d: Datum): any => this.xScale(this.xIsBaseline ? this.x(d) : aOrB(d.x1, this.x(d)))
    this.y0 = (d: Datum): any => this.yScale(this.xIsBaseline ? aOrB(d.y0, 0) : this.y(d))
    this.y1 = (d: Datum): any => this.yScale(this.xIsBaseline ? aOrB(d.y1, this.y(d)) : this.y(d))
  }

  private assignAccessors(customAccessors: Partial<AreaRendererAccessors>): void {
    const accessors: AreaRendererAccessors = defaults(defaultAccessors)(customAccessors)
    this.x = (d: Datum): any => aOrB(this.series.x(d), d.injectedX)
    this.y = (d: Datum): any => aOrB(this.series.y(d), d.injectedY)
    this.color = (d?: Datum): string => accessors.color(this.series, d)
    this.interpolate = (d?: Datum): any => interpolator[accessors.interpolate(this.series, d)]
    this.closeGaps = (d?: Datum): boolean => accessors.closeGaps(this.series, d)
  }

  private addMissingData(): void {
    if (this.closeGaps()) {
      return
    }
    if (this.xIsBaseline && !this.series.options.stacked) {
      const ticks: Date[] = this.state.current.get("computed").series.dataForAxes[this.series.xAxis()]
      forEach((tick: Date): void => {
        if (!find((d: Datum): boolean => this.x(d).toString() === tick.toString())(this.data)) {
          this.data.push({ injectedX: tick, injectedY: undefined })
        }
      })(ticks)
    }
  }

  private updateClipPath(): void {
    const duration: number = this.state.current.get("config").duration
    const data: Datum[] = this.series.options.clipData ? [this.series.options.clipData] : []

    const clip = this.el.selectAll("clipPath path").data(data)

    clip
      .enter()
      .append("svg:clipPath")
      .attr("id", `area-clip-${this.series.key()}`)
      .append("svg:path")
      .attr("d", this.startPath.bind(this))
      .merge(clip)
      .transition()
      .duration(duration)
      .attr("d", this.clipPath.bind(this))

    clip
      .exit()
      .transition()
      .duration(duration)
      .attr("d", this.startPath.bind(this))
      .remove()
  }

  private isDefined(d: Datum): boolean {
    return this.series.options.stacked && this.closeGaps() ? true : hasValue(this.x(d)) && hasValue(this.y(d))
  }

  private createAreaPath(attributes: any): any {
    return d3Area()
      .x0(attributes.x0 || attributes.x)
      .x1(attributes.x1 || attributes.x)
      .y0(attributes.y0 || attributes.y)
      .y1(attributes.y1 || attributes.y)
      .curve(this.interpolate())
      .defined(this.isDefined.bind(this))
  }

  private startPath(data: Datum[]): string {
    return this.createAreaPath({
      x: (d: Datum): any => this.xScale(this.xIsBaseline ? this.x(d) : 0),
      y: (d: Datum): any => this.yScale(this.xIsBaseline ? 0 : this.y(d)),
    })(data)
  }

  private path(data: Datum[]): string {
    return this.createAreaPath(this)(data)
  }

  private clipPath(data: Datum[]): string {
    return this.createAreaPath({
      x0: this.xIsBaseline ? this.x0 : this.xScale.range()[1],
      x1: this.x1,
      y0: (d: Datum) => (this.xIsBaseline ? 0 : this.y0(d)),
      y1: this.y1,
    })(data)
  }
}

export default Area
