import AbstractFocus from "./abstract_focus"
import Events from "./event_catalog"
import { IState, TStateWriter, TEvents, TSeriesEl } from "./typings"

abstract class AbstractDrawingFocus extends AbstractFocus {
  constructor(state: IState, stateWriter: TStateWriter, events: TEvents, el: TSeriesEl) {
    super(state, stateWriter, events, el)
    this.events.on(Events.FOCUS.ELEMENT.HOVER, this.onElementHover())
    this.events.on(Events.FOCUS.ELEMENT.OUT, this.onElementOut())
    this.events.on(Events.CHART.OUT, this.onMouseLeave())
  }

  abstract onElementHover(): (payload: { focusPoint: any; d: any }) => void

  onElementOut(): () => void {
    return () => {
      this.remove()
    }
  }

  onMouseLeave(): () => void {
    return () => {
      this.remove()
    }
  }
}

export default AbstractDrawingFocus
