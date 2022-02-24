const IsProd = process.env.NODE_ENV === 'production'
const Port = process.env.PORT || 3000
const MongoUri = process.env.MONGO_URI || ''
const JwtSecret = () => process.env.JWT_SECRET || ''

export const config = { IsProd, Port, MongoUri, JwtSecret }
