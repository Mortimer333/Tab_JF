/**
 * Hidden class is used to hide some methods from debug tool which monitors how script behaves by attaching Proxy to all methods and attrbiutes
 * (omiting those starting with `_`).
 */
class TabJF_Hidden {
  /**
   * Debounce factory.
   * Passed function here will be fired after set `timeout` but the timeout will be postponed for another `timeout` value each time returned
   * method was called.
   * Example:
   *
   * this.debounceTest = this.debounce(countdown, 200);      // Create debounce function
   * this.debounceTest();                                    // Start the timer to fire `countdown` after 200ms
   * ... // 10ms later
   * this.debounceTest();                                    // Reset timer to fire `countdown` after 200ms from now so it 210ms from the
   *                                                         // first time `countdown` was called
   *
   * In case you started the countdown and want to prevent it can call returned function again with `clear` as first argument. This will clear
   * the timeout. Example:
   * 
   * this.debounceTest('clear');
   *
   * @param  {function} func          Function to fire
   * @param  {Number  } [timeout=300] Timeout after function should be called
   * @return {function}               The debounce function to call if you want to start or postpone saved method
   */
  debounce (func, timeout = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      if ( args[0] === "clear" ) {
        return; // if passed `clear` then stop debouncing
      }

      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
  }
}
export { TabJF_Hidden };
