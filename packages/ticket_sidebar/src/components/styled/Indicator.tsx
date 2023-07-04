import styled, { css } from 'styled-components'
import type { OrderStatus } from '../../types'

const Indicator = styled.div<{ $type: OrderStatus }>`
  width: 12px;
  height: 12px;
  border-radius: 100%;
  display: inline-block;
  margin-right: 8px;

  ${(props) => {
    switch (props.$type) {
      case 'confirmed': {
        return css`
          background-color: var(--zd-color-grey-800);
        `
      }
      case 'checkout': {
        return css`
          background-color: var(--zd-color-grey-800);
        `
      }
      case 'preparing': {
        return css`
          background-color: var(--zd-color-kale-600);
        `
      }
      case 'prepared': {
        return css`
          background-color: var(--zd-color-secondary-fuschia-600);
        `
      }
      case 'delivering': {
        return css`
          background-color: var(--zd-color-blue-600);
        `
      }
      case 'delivered': {
        return css`
          background-color: var(--zd-color-green-600);
        `
      }
      case 'cancelled_by_customer': {
        return css`
          background-color: var(--zd-color-secondary-crimson-600);
        `
      }
      case 'cancelled_by_system': {
        return css`
          background-color: var(--zd-color-secondary-crimson-600);
        `
      }
      case 'user_unreachable': {
        return css`
          background-color: var(--zd-color-yellow-400);
        `
      }
      case 'delayed': {
        return css`
          background-color: var(--zd-color-secondary-lemon-400);
        `
      }
    }
  }}
`
export { Indicator }
