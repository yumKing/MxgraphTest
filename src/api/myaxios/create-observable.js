import { Observable } from 'rxjs';
import axios from 'axios';
export function createObservable(promiseFactory, ...args) {
    let config = args[args.length - 1];
    config = config ? { ...config } : {};
    args[args.length - 1] = config;
    let cancelSource;
    const hasCancelToken = !!config.cancelToken;
    if (hasCancelToken) {
        console.warn('No need to use cancel token, just unsubscribe the subscription would cancel the http request automatically');
    }
    const observable = new Observable(subscriber => {
        if (!hasCancelToken) {
            cancelSource = axios.CancelToken.source();
            config.cancelToken = cancelSource.token;
        }
        promiseFactory(...args)
            .then(response => {
            subscriber.next(response);
            subscriber.complete();
        })
            .catch(error => subscriber.error(error));
    });
    const _subscribe = observable.subscribe.bind(observable);
    observable.subscribe = (...args2) => {
        const subscription = _subscribe(...args2);
        const _unsubscribe = subscription.unsubscribe.bind(subscription);
        subscription.unsubscribe = () => {
            if (cancelSource) {
                cancelSource.cancel();
            }
            _unsubscribe();
        };
        return subscription;
    };
    return observable;
}
//# sourceMappingURL=create-observable.js.map