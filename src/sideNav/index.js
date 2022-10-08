import React, {useEffect} from 'react'

import NavList from 'sideNav/view'
import NavItem from 'conf/navItem'

export default (props) => {

  const {history} = props
  const [locInfo, setLocInfo] = React.useState(props.locInfo)
  const [navItems, setNavItems] = React.useState(NavItem({}))

  useEffect(() => {
    handleItems(window.location.pathname.split("/")[2])
    setPath(window.location.pathname.split("/"))
  }, [])

  const handleClick = name => {
    // console.log(name)
    handleItems(name)
  }

  const handleItems = name => {
    const items = [...navItems]

    if (!items || !items.map) {
      return
    }

    items.map(i => {

      if (i.name === name) {
        i.selected = !i.selected
      }
    })

    setNavItems(items)
  }

  const moveLoc = link => {

    if (!link || typeof link !== 'string') {
      return
    }
    const loc = link.split('/')

    if (loc.length > 1) {

      handleItems(loc[3])
    }
    
    setPath(loc)

    history.push(link)
  }

  const setPath = loc => {

    // console.log(loc);

    if (loc.length < 3) {
      setLocInfo({parent: loc[1], child: ''})
      return
    }

    if (loc.length === 4) {
      // console.log("!!!!")
      setLocInfo({parent: loc[1], child: loc[2]})
    }

    setLocInfo({parent: loc[2], child: loc[3]})

  }

  return (
    <NavList items={navItems} locInfo={locInfo} moveLoc={moveLoc} handleClick={handleClick} />
  )
}