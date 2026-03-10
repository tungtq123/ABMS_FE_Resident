import { Button } from 'react-bootstrap';

function AppButton({ children, type = 'button', variant = 'primary', ...props }) {
  return (
    <Button type={type} variant={variant} {...props}>
      {children}
    </Button>
  );
}

export default AppButton;