import React from 'react'

import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'

export default () => (
  <Typography variant="body2" color="textSecondary" align="center">
    Copyright ©{process.env.REACT_APP_TITLE} <span></span>
    <Link color="inherit" href={process.env.REACT_APP_API_URL}>Your Website</Link>{' 2021 .'}
  </Typography>
)