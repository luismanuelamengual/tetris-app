import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import { Button, ButtonType } from 'components';

describe('<Button />', () => {
  it('renders button successfully', () => {
    render(<Button>Click Me</Button>);
  });

  it('renders button class successfully', () => {
    const { container } = render(<Button>Click Me</Button>);
    expect(container.firstChild).toHaveClass('button');
  });

  it('renders primary button successfully', () => {
    const { container } = render(<Button type={ButtonType.PRIMARY}>Click Me</Button>);
    expect(container.firstChild).toHaveClass('button-primary');
  });

  it('renders disabled button successfully', () => {
    const { container } = render(<Button disabled>Click Me</Button>);
    expect(container.firstChild).toHaveClass('button-disabled');
  });
});
