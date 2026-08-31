import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';

export interface SlotRecipe {
  id: string;
  title: string;
  image: string;
}

@Component({
  tag: 'meal-plan-slot',
  styleUrl: 'meal-plan-slot.css',
  shadow: true,
})
export class MealPlanSlot {
  @Prop() day!: string;
  @Prop() recipe: SlotRecipe | null = null;

  @Event() recipeRemove!: EventEmitter<{ day: string }>;

  render() {
    return (
      <div class="slot">
        <div class="day-label">{this.day}</div>
        {this.recipe ? (
          <div class="filled">
            {this.recipe.image ? <img src={this.recipe.image} alt={this.recipe.title} /> : null}
            <span class="title">{this.recipe.title}</span>
            <button
              type="button"
              class="remove"
              onClick={() => this.recipeRemove.emit({ day: this.day })}
              aria-label={`Remove ${this.recipe.title} from ${this.day}`}
            >
              ✕
            </button>
          </div>
        ) : (
          <div class="empty">
            <slot>No meal planned</slot>
          </div>
        )}
      </div>
    );
  }
}
