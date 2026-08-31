import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';

@Component({
  tag: 'filter-panel',
  styleUrl: 'filter-panel.css',
  shadow: true,
})
export class FilterPanel {
  @Prop() categories: string[] = [];
  @Prop() selected: string[] = [];

  @Event() filterChange!: EventEmitter<{ selected: string[] }>;

  private toggle(cat: string) {
    const next = this.selected.includes(cat)
      ? this.selected.filter((c) => c !== cat)
      : [...this.selected, cat];
    this.filterChange.emit({ selected: next });
  }

  render() {
    return (
      <div class="filters" role="group" aria-label="Filter by category">
        {this.categories.map((cat) => (
          <button
            type="button"
            class={{ chip: true, active: this.selected.includes(cat) }}
            onClick={() => this.toggle(cat)}
            aria-pressed={this.selected.includes(cat) ? 'true' : 'false'}
          >
            {cat}
          </button>
        ))}
      </div>
    );
  }
}
