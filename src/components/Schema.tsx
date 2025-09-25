interface SchemaProps {
  schemas: Record<string, unknown>[];
}

export default function Schema({ schemas }: SchemaProps) {
  if (!schemas.length) return null;

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 0)
          }}
        />
      ))}
    </>
  );
} 