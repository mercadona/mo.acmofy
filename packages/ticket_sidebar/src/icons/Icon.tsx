import { icons } from './icons'

type IconType = keyof typeof icons

type IconProps = {
  type: IconType
}

const Icon = ({ type: icon }: IconProps) => {
  return icons[icon]
}

export default Icon
