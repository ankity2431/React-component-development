# React-Component Development : react-component-development-puce.vercel.app

InputField Features
• Multiple variants: filled, outlined, ghost<br>
• Three sizes: small, medium, large<br>
• States: disabled, invalid, loading<br>
• Optional clear button and password toggle<br>
• Full accessibility support with ARIA labels<br>
• TypeScript with proper typing<br>
• Responsive design<br>


DataTable Features
• Generic TypeScript support for any data type<br>
• Column sorting with visual indicators<br>
• Single and multi-row selection<br>
• Loading and empty states<br>
• Custom cell rendering<br>
• Responsive design with horizontal scroll<br>
• Accessible with proper ARIA attributes<br>

# My Approach

For this assignment, I tried to keep the code simple, clean, and easy to scale. I used React, TypeScript, and TailwindCSS for building the UI components. Storybook was added for documentation and for testing different states of the components quickly.

<h3>InputField Component</h3>

- I created a reusable input with support for label, placeholder, helper text, and error message.
- Added multiple variants (filled, outlined, ghost) and sizes (sm, md, lg) using Tailwind utility classes.
- Different states like disabled, invalid, and loading are handled with conditional classes.
- Extra features like clear button and password toggle were included to make it more useful.
- The component also supports light and dark themes using Tailwind’s dark: classes.

<h3>DataTable Component</h3>

- Built a generic table component with TypeScript generics so it can render any type of data.
- Added sorting on columns where applicable.
- Implemented row selection with both single and multiple select modes.
- Added loading state with a spinner and an empty state when there’s no data.
- Made sure it is responsive and has basic accessibility attributes (like ARIA labels).

<h3>Structure & Testing</h3>

- Components are separated into their own folders with clear structure.
- Storybook stories show different states, variants, and use cases.
- Added a couple of basic tests for rendering and interactions.
- Overall, I focused on writing scalable and reusable components with good styling, typing, and documentation.
