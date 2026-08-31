import { Component, Prop, State, Event, EventEmitter, h } from '@stencil/core';

@Component({
  tag: 'search-bar',
  styleUrl: 'search-bar.css',
  shadow: true,
})
export class SearchBar {
  @Prop() value: string = '';
  @Prop() placeholder: string = 'Search recipes…';

  @State() internalValue: string = this.value;

  @Event() searchSubmit!: EventEmitter<{ query: string }>;

  private onInput = (e: Event) => {
    this.internalValue = (e.target as HTMLInputElement).value;
  };

  private onSubmit = (e: Event) => {
    e.preventDefault();
    this.searchSubmit.emit({ query: this.internalValue.trim() });
  };

  render() {
    return (
      <form class="search-form" onSubmit={this.onSubmit}>
        <input
          type="search"
          value={this.internalValue}
          placeholder={this.placeholder}
          onInput={this.onInput}
          aria-label="Search recipes"
        />
        <button type="submit">Search</button>
      </form>
    );
  }
}
