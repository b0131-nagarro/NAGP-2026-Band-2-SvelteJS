import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';

@Component({
  tag: 'star-rating',
  styleUrl: 'star-rating.css',
  shadow: true,
})
export class StarRating {
  @Prop() value: number = 0;
  @Prop() max: number = 5;
  @Prop() readonly: boolean = false;

  @Event() ratingChange!: EventEmitter<{ value: number }>;

  private setRating(v: number) {
    if (this.readonly) return;
    this.ratingChange.emit({ value: v });
  }

  render() {
    const stars = Array.from({ length: this.max }, (_, i) => i + 1);
    return (
      <div class="stars" role={this.readonly ? 'img' : 'radiogroup'} aria-label={`${this.value} out of ${this.max} stars`}>
        {stars.map((i) => (
          <button
            type="button"
            class={{ star: true, filled: i <= this.value }}
            disabled={this.readonly}
            onClick={() => this.setRating(i)}
            aria-label={`${i} star${i > 1 ? 's' : ''}`}
          >
            {i <= this.value ? '★' : '☆'}
          </button>
        ))}
      </div>
    );
  }
}
