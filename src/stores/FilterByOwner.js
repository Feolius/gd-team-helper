import {decorate, observable, reaction, computed, action, runInAction} from 'mobx';
import singleton from 'singleton';

class FilterByOwnerStore extends singleton {
    ownerValue = '';

    setOwnerValue(value) {
        this.ownerValue = value;
    }
}

export default decorate(FilterByOwnerStore, {
    ownerValue: observable,
    setOwnerValue: action
}).get();
