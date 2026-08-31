import { Component, Prop, State, Event, EventEmitter, h } from '@stencil/core';

export interface RecipeInput {
  title: string;
  image: string;
  ingredients: string[];
  instructions: string;
}

@Component({
  tag: 'recipe-form',
  styleUrl: 'recipe-form.css',
  shadow: true,
})
export class RecipeFormEl {
  @Prop() initialValue: RecipeInput | null = null;

  @State() title: string = this.initialValue?.title ?? '';
  @State() image: string = this.initialValue?.image ?? '';
  @State() ingredientsText: string = this.initialValue?.ingredients?.join('\n') ?? '';
  @State() instructions: string = this.initialValue?.instructions ?? '';
  @State() error: string = '';

  @Event() formSubmit!: EventEmitter<RecipeInput>;
  @Event() formCancel!: EventEmitter<void>;

  private onSubmit = (e: Event) => {
    e.preventDefault();
    if (!this.title.trim() || !this.instructions.trim()) {
      this.error = 'Title and instructions are required.';
      return;
    }
    this.error = '';
    this.formSubmit.emit({
      title: this.title.trim(),
      image: this.image.trim(),
      ingredients: this.ingredientsText.split('\n').map((s) => s.trim()).filter(Boolean),
      instructions: this.instructions.trim(),
    });
  };

  render() {
    return (
      <form class="recipe-form" onSubmit={this.onSubmit}>
        {this.error ? <p class="error">{this.error}</p> : null}
        <label>
          <span>Title</span>
          <input value={this.title} onInput={(e) => (this.title = (e.target as HTMLInputElement).value)} />
        </label>
        <label>
          <span>Image URL</span>
          <input value={this.image} onInput={(e) => (this.image = (e.target as HTMLInputElement).value)} />
        </label>
        <label>
          <span>Ingredients (one per line)</span>
          <textarea rows={5} onInput={(e) => (this.ingredientsText = (e.target as HTMLTextAreaElement).value)}>
            {this.ingredientsText}
          </textarea>
        </label>
        <label>
          <span>Instructions</span>
          <textarea rows={6} onInput={(e) => (this.instructions = (e.target as HTMLTextAreaElement).value)}>
            {this.instructions}
          </textarea>
        </label>
        <div class="actions">
          <button type="button" class="ghost" onClick={() => this.formCancel.emit()}>
            Cancel
          </button>
          <button type="submit" class="primary">
            Save recipe
          </button>
        </div>
      </form>
    );
  }
}
