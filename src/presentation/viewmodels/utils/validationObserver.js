class ValidationObserver {
    constructor() {
        this.observers = [];
        this.errors = new Set();
    }

    subscribe(callback) {
        this.observers.push(callback);

        return () => {
            this.observers = this.observers.filter(
                observer => observer !== callback
            );
        };
    }

    notify() {
        this.observers.forEach(observer => {
            observer(this.errors);
        });
    }

    addError(field) {
        this.errors.add(field);
        this.notify();
    }

    removeError(field) {
        this.errors.delete(field);
        this.notify();
    }

    hasErrors() {
        return this.errors.size > 0;
    }

    clear() {
        this.errors.clear();
        this.notify();
    }

    getErrors() {
        return [...this.errors];
    }
}

export default new ValidationObserver();