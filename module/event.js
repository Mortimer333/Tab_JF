class TabJF_Event {
  /**
   * Dispatch custom event
   * Across editor we have few custom events which this function makes easier to fire.
   * @param  {String} name         Name of event
   * @param  {Object} [details={}] Addtional info added to event
   * @return {Object}              Configurated custom event
   */
  dispatch (name, details = {}) {
    details = Object.assign({ instance : this }, details);
    const event = this.event.create(name, details);
    this.editor.dispatchEvent(event);
    return event;
  }

  /**
   * Creates custom event with acctional data
   * @param  {String} name         Name of event
   * @param  {Object} [details={}] Additional information about event
   * @return {Object}              Custom Event
   */
  create (name, details={}) {
    return new CustomEvent(name, {
      detail     : details,
      bubbles    : true,
      cancelable : true,
      composed   : true,
    });
  }
}
export { TabJF_Event };
