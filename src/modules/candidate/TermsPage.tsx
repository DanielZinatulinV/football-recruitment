import Footer from '../../components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <section className="flex-1 w-full max-w-3xl mx-auto py-16 px-4">
        <h1 className="text-3xl font-bold text-yellow-300 mb-8 uppercase text-center tracking-wide">Условия использования</h1>
        <div className="text-white text-lg space-y-6">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, urna eu tincidunt consectetur, nisi nisl aliquam nunc, eget aliquam massa nisl quis neque. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
          </p>
          <p>
            Nullam ac urna eu felis dapibus condimentum sit amet a augue. Sed non neque elit. Sed ut imperdiet nisi. Proin condimentum fermentum nunc. Etiam pharetra, erat sed fermentum feugiat, velit mauris egestas quam, ut aliquam massa nisl quis neque.
          </p>
          <p>
            Suspendisse in orci enim. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra.
          </p>
        </div>
      </section>
    </div>
  );
} 