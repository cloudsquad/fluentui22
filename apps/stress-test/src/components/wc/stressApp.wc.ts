import { FASTElement, customElement, attr, html, css, repeat, ValueConverter } from '@microsoft/fast-element';
import { getTestParams } from '../../shared/testParams';
import { performanceMeasure } from '../../shared/performanceMeasure';
import { StressComponent } from './stressComponent.wc';

const styles = css`
  :host {
    width: 100%;
    height: 100%;
  }
`;

const template = html<StressApp>`
  <stress-container>
    ${repeat(
      el => new Array(el.numchildren),
      html<StressComponent, StressApp>`<stress-component
        checked=${(el, ctx) => ctx.parent.checked}
      ></stress-component>`,
    )}
  </stress-container>
`;

const numberConverter: ValueConverter = {
  toView(value: any): string {
    return String(value);
  },

  fromView(value: string): number {
    return Number(value);
  },
};

@customElement({
  name: 'stress-app',
  template,
  styles,
})
export class StressApp extends FASTElement {
  @attr({ converter: numberConverter }) public numchildren: number = 10;
  @attr({ mode: 'boolean' }) public checked: boolean = false;

  public connectedCallback(): void {
    super.connectedCallback();

    const { test, numStartNodes, numAddNodes, numRemoveNodes } = getTestParams();

    if (test === 'prop-update') {
      setTimeout(() => {
        performanceMeasure('stress', 'start');
        this.checked = true;
      }, 2000);
    } else if (test === 'add-node') {
      setTimeout(() => {
        performanceMeasure('stress', 'start');
        this.numchildren = numStartNodes + numAddNodes;
      }, 2000);
    } else if (test === 'remove-node') {
      setTimeout(() => {
        performanceMeasure('stress', 'start');
        this.numchildren = numStartNodes - numRemoveNodes;
      }, 2000);
    }
  }
}
