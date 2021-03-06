import { h, Component } from 'preact';

export class AutoCompleteItem extends Component {
  onItemClick = () => {
    this.props.onItemClick(this.props.data);
  }

  render() {
    const isClickable = (typeof this.props.data.clickable === 'undefined') ? true : this.props.data.clickable;

    let classes = "autocomplete__item";
    if (isClickable) {
      classes += " autocomplete__item--clickable";
    }

    return (<div class={classes} onClick={(isClickable) ? this.onItemClick : null}>{this.props.name}</div>);
  }
}

export default class AutoComplete extends Component {
  constructor(props) {
    super(props);

    this.state = {
      input: props.default || '',
      focus: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.default !== this.props.default) {
      this.setState({ input: nextProps.default || '' });
    }
  }

  onItemClick = data => {
    this.setState({ input: data[this.props.itemNameProp], focus: false, mouseIn: false });

    if (this.props.onItemClick) {
      this.props.onItemClick(data);
    }

    if (this.props.onItemChange) {
      this.props.onItemChange(data);
    }
  }

  createItem(data) {
    return <AutoCompleteItem onItemClick={this.onItemClick} name={data[this.props.itemNameProp]} data={data} />;
  }

  onInputInput = (e) => {
    this.setState({ input: e.target.value });

    if (this.props.onItemChange) {
      const valLower = e.target.value.toLowerCase();
      const item = this.props.data.find(v => v[this.props.itemNameProp].toLowerCase() === valLower);

      if (item) {
        this.props.onItemChange(item);
      } else {
        this.props.onItemChange(undefined);
      }
    }
  }

  onInputFocus = () => {
    this.setState({ focus: true });
  }

  onInputBlur = () => {
    this.setState({ focus: false });
  }

  onContainerMouseEnter = () => {
    this.setState({ mouseIn: true });
  }

  onContainerMouseLeave = () => {
    this.setState({ mouseIn: false });
  }

  getFilteredItems = () => {
    const notHasInput = this.state.input.length === 0;
    const input = this.state.input.toLowerCase();

    let filtered = this.props.data.filter(v => notHasInput || v[this.props.itemNameProp].toLowerCase().indexOf(input) !== -1);
    if (filtered.length === 1) {
      let item = filtered.shift();
      filtered = this.props.data.filter(v => v[this.props.itemNameProp] !== item[this.props.itemNameProp]);
      filtered.unshift(item);
    }

    return filtered;
  }

  render() {
    const containerDisplay = ((this.state.focus || this.state.mouseIn) && !this.props.disabled) ? "block" : "none";

    let items = this.getFilteredItems();
    if (items.length === 0) {
      items = [{ name: 'No Matches', clickable: false }];
    }

    return (
      <div class="autocomplete">
        <input disabled={this.props.disabled} type="text" placeholder={this.props.placeholder} onInput={this.onInputInput} value={this.state.input} onFocus={this.onInputFocus} onBlur={this.onInputBlur} />
        <div class="autocomplete__container" style={{display: containerDisplay}} onMouseEnter={this.onContainerMouseEnter} onMouseLeave={this.onContainerMouseLeave}>
          {items.map(v => this.createItem(v))}
        </div>
      </div>
    );
  }
}
