class TabJF_Event {
  dispatch (name, details = {}) {
    details = Object.assign({ instance : this }, details);
    const event = this.event.create(name, details);
    this.editor.dispatchEvent(event);
    return event;
  }

  create (name, details) {
    return new CustomEvent(name, {
      detail     : details,
      bubbles    : true,
      cancelable : true,
      composed   : true,
    });
  }
}
