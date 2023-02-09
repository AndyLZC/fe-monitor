export function on(
    target: Window | HTMLElement,
    event: string,
    handler: EventListenerOrEventListenerObject,
    capture: false
) {
    if(typeof target?.addEventListener === 'function') {
        target.addEventListener(event, handler, capture)
    }
}

export function off(
    target: Window | HTMLElement,
    event: string,
    handler: EventListenerOrEventListenerObject,
    capture: false
) {
    if(typeof target?.removeEventListener === 'function') {
        target.removeEventListener(event, handler, capture)
    }
}