import {Image} from '@shopify/hydrogen';

export function EmotionSection() {
  return (
    <>
      {/* Première section - Image à droite */}
      <section className="emotion-section">
        <div className="emotion-container">
          <div className="emotion-content">
            <h3 className="emotion-title">
              Plongez dans l&apos;univers des émotions
            </h3>
            <p className="emotion-text">
              <span className="bullet">✦</span> Chaque objet de notre collection est une passerelle vers l&apos;intime, un fragment d&apos;émotion gravé dans le temps. Il réveille en nous un souvenir, une sensation, un sourire enfoui.
            </p>
            <p className="emotion-text">
              <span className="bullet">✦</span> Ces créations artisanales, bien plus que de simples décorations, sont une invitation à ralentir, à contempler, à ressentir. Offrez un instant suspendu, un fragment de poésie à garder précieusement.
            </p>
          </div>

          <div className="emotion-image-container">
            <Image
              src="/images/boite-a-musique-en-bois-artisanale-emotive.jpg.png"
              alt="Boîte à musique artisanale en bois"
              width={500}
              height={500}
              className="emotion-image"
            />
          </div>
        </div>
      </section>

      {/* Deuxième section - Image à gauche */}
      <section className="emotion-section emotion-section-reversed">
        <div className="emotion-container emotion-container-reversed">
          <div className="emotion-content">
            <h3 className="emotion-title">
              Quand l&apos;objet devient messager
            </h3>
            <p className="emotion-text">
              <span className="bullet">✦</span> Nos créations sont bien plus que de simples objets : elles parlent à la mémoire, au cœur, à l&apos;âme. Elles disent l&apos;amour, l&apos;amitié, la nostalgie ou le rêve, sans un mot.
            </p>
            <p className="emotion-text">
              <span className="bullet">✦</span> Inspirées par les grands gestes du passé et le raffinement des matières, elles incarnent une poésie discrète, à transmettre de génération en génération.
            </p>
          </div>

          <div className="emotion-image-container">
            <Image
              src="/images/artisan-creation-boite-a-musique-peinture-tradition.jpg.png"
              alt="Artisan créant une boîte à musique avec peinture traditionnelle"
              width={500}
              height={500}
              className="emotion-image"
            />
          </div>
        </div>
      </section>
    </>
  );
} 