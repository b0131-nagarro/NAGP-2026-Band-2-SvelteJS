import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';

@Component({
  tag: 'recipe-card',
  styleUrl: 'recipe-card.css',
  shadow: true,
})
export class RecipeCard {
  @Prop() recipeId!: string;
  @Prop() recipeTitle!: string;
  @Prop() image: string = '';
  @Prop() favorited: boolean = false;

  @Event() favoriteToggle!: EventEmitter<{ id: string }>;

  private onFavoriteClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.favoriteToggle.emit({ id: this.recipeId });
  };

  render() {
    return (
      <a class="card" href={`/recipes/${this.recipeId}`}>
        <div class="image-wrap">
          {this.image ? <img src={this.image} alt={this.recipeTitle} /> : <div class="image-placeholder" />}
          <button
            class={{ 'fav-btn': true, active: this.favorited }}
            onClick={this.onFavoriteClick}
            aria-label="Toggle favorite"
            aria-pressed={this.favorited ? 'true' : 'false'}
          >
            {this.favorited ? '♥' : '♡'}
          </button>
        </div>
        <div class="body">
          <h3>{this.recipeTitle}</h3>
          <div class="tags">
            <slot />
          </div>
        </div>
      </a>
    );
  }
}
