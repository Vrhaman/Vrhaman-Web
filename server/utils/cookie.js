const setAuthCookie = (res, userId, role, token) => {
  const domain = process.env.DOMAIN_URL;

  const cookieOptions = {
    maxAge: 1000 * 60 * 60 * 24 * 30,
    secure: true,
    domain: domain,
    sameSite: "None",
  };

  res.cookie("userId", userId, cookieOptions);
  res.cookie("token", token, cookieOptions);
  res.cookie("loggedIn", true, cookieOptions);
  res.cookie("role", role, cookieOptions);
};

module.exports = setAuthCookie;
