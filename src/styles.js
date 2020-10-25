import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  max-width: 100%;
  padding: 1rem;

  & h1 {
    color: var(--color-title);
    margin: 1rem 0 3rem 0;
  }

  & main {
    width: 100%;
    max-width: 600px;
    border-radius: 0.3rem;
    background-color: var(--color-white);
  }
`;

export const CheckboxContainer = styled.li`
  width: 100%;
  padding: 0 1rem;
  list-style: none;

  &:hover {
    background-color: var(--color-checkbox-container-hover);
    cursor: pointer;
  }
`;

export const CheckboxContent = styled.div`
  display: flex;
  align-items: center;
  margin-left: ${props => props.marginLeft}rem;

  & label {
    width: 90%;
    padding: 1rem;
  }

  & label:hover {
    cursor: pointer;
  }

  & svg {
    font-size: 20px;
    color: var(--color-primary);
    transition: all 0.3s;
  }

  & svg.expanded {
    color: var(--color-active);
    transform: rotate(-180deg);
  }
`;

export const Checkbox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 1rem;
  height: 1rem;
  margin-right: 1rem;
  border: 2px solid var(--color-primary);
  border-radius: 0.1rem;

  &.checked {
    background: var(--color-active);
    border: 2px solid var(--color-active);
  }

  & svg {
    color: var(--color-white);
  }
`;