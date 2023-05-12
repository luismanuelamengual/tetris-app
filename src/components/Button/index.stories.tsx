import type { Meta, StoryObj } from '@storybook/react';
import { Button, ButtonType } from './index';

const meta: Meta<typeof Button> = {
  component: Button,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Classic: Story = {
  args: {
    children: 'Click Me',
  }
};

export const Primary: Story = {
  args: {
    children: 'Click Me',
    type: ButtonType.PRIMARY
  }
};

export const Disabled: Story = {
  args: {
    children: 'Click Me',
    disabled: true
  }
};