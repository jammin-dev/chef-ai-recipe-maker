import * as React from "react";
import { useState } from "react";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

/**
 * Example modal component showing your Privacy Policy
 * in both English and French.
 */
export function PrivacyPolicyModal({ open, setOpen }) {
	// const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			{/* 
        TRIGGER
        Replace this with your own icon or element 
        (e.g., a suitcase/valise icon) 
      */}
			{/* <DialogTrigger asChild>
				<Button variant="outline">Open Privacy Policy</Button>
			</DialogTrigger> */}

			{/* 
        CONTENT
        You can style maxWidth, height, etc. as needed 
      */}
			<DialogContent className="max-w-3xl h-screen md:h-11/12">
				{/* 
          Close button (the cross) at top-right 
        */}
				<button
					onClick={() => setOpen(false)}
					className="absolute right-4 top-4 rounded-md hover:opacity-80"
					type="button"
				>
					<X className="h-4 w-4" />
				</button>

				<DialogHeader>
					<DialogTitle>Privacy Policy</DialogTitle>
					<DialogDescription>
						Please review the following terms carefully.
					</DialogDescription>
				</DialogHeader>

				{/* 
          SCROLLABLE CONTENT
          Make this container scrollable for large texts. 
        */}
				<div className="h-full overflow-y-auto pr-2">
					{/* ----------------------- ENGLISH ----------------------- */}
					<h2 className="mt-4 text-lg font-semibold">Privacy Policy</h2>
					<p className="text-sm">
						<strong>Effective Date: April 1, 2025</strong>
						<br />
						Welcome to Chef! (&quot;Service&quot;). This Privacy Policy explains
						how we collect, use, and protect your personal information when you
						use our Service.
					</p>

					<h3 className="mt-4 font-semibold">1. Information We Collect</h3>
					<p className="text-sm">
						<strong>Personal Information:</strong> When registering or using our
						Service, we may collect information such as your name, email
						address, and dietary preferences.
						<br />
						<strong>Usage Data:</strong> We collect anonymous usage data such as
						your interactions with our Service and the type of device and
						browser you use.
					</p>

					<h3 className="mt-4 font-semibold">2. How We Use Your Information</h3>
					<p className="text-sm">
						We use your information to:
						<br />• Provide, operate, and improve our Service.
						<br />• Personalize your user experience by generating recipes based
						on your preferences.
						<br />• Respond to your inquiries and support requests.
					</p>

					<h3 className="mt-4 font-semibold">3. Sharing of Information</h3>
					<p className="text-sm">
						We do not sell, trade, or otherwise transfer your personal
						information to third parties. We may share aggregated, anonymized
						information for analysis and improvement of the Service.
					</p>

					<h3 className="mt-4 font-semibold">4. Data Security</h3>
					<p className="text-sm">
						We implement industry-standard security measures to protect your
						personal data from unauthorized access, disclosure, alteration, or
						destruction. However, no method of online transmission or storage is
						entirely secure.
					</p>

					<h3 className="mt-4 font-semibold">5. Cookies</h3>
					<p className="text-sm">
						Chef! may use cookies and similar tracking technologies to enhance
						your experience, track usage patterns, and collect statistical
						information.
					</p>

					<h3 className="mt-4 font-semibold">6. Third-Party Services</h3>
					<p className="text-sm">
						Our Service uses the OpenAI API to generate recipes. OpenAI’s own
						privacy policy applies to data processed by its services. Please
						review OpenAI’s privacy policy for further information.
					</p>

					<h3 className="mt-4 font-semibold">7. Children&apos;s Privacy</h3>
					<p className="text-sm">
						Chef! is not intended for use by children under the age of 13. We do
						not knowingly collect or solicit personal information from minors.
					</p>

					<h3 className="mt-4 font-semibold">
						8. Changes to This Privacy Policy
					</h3>
					<p className="text-sm">
						We may update this Privacy Policy occasionally. Any updates will be
						communicated via our Service. Continued use of the Service after
						updates indicates acceptance of the revised policy.
					</p>

					<h3 className="mt-4 font-semibold">9. Your Rights</h3>
					<p className="text-sm">
						You have the right to access, correct, or delete your personal
						information. For any such requests, please contact us directly.
					</p>

					<h3 className="mt-4 font-semibold">10. Contact Information</h3>
					<p className="text-sm">
						For questions about this Privacy Policy or your data, please contact
						us at{" "}
						<a href="mailto:benjamin.vandamme@me.com">
							benjamin.vandamme@me.com
						</a>
						.
					</p>

					<p className="text-sm mt-2">
						By using Chef!, you consent to the terms of this Privacy Policy.
					</p>

					<hr className="my-6" />

					{/* ----------------------- FRENCH ----------------------- */}
					<h2 className="mt-4 text-lg font-semibold">
						Politique de Confidentialité
					</h2>
					<p className="text-sm">
						<strong>Date d&apos;entrée en vigueur : 1er avril 2025</strong>
						<br />
						Bienvenue sur Chef! (« Service »). Cette Politique de
						Confidentialité explique comment nous collectons, utilisons et
						protégeons vos informations personnelles lorsque vous utilisez notre
						Service.
					</p>

					<h3 className="mt-4 font-semibold">
						1. Informations que nous collectons
					</h3>
					<p className="text-sm">
						<strong>Informations personnelles :</strong> Lors de votre
						inscription ou de l&apos;utilisation du Service, nous pouvons
						collecter des informations telles que votre nom, votre adresse
						e-mail et vos préférences alimentaires.
						<br />
						<strong>Données d&apos;utilisation :</strong> Nous collectons des
						données anonymes sur votre utilisation du Service, telles que vos
						interactions avec celui-ci, ainsi que le type d&apos;appareil et de
						navigateur que vous utilisez.
					</p>

					<h3 className="mt-4 font-semibold">
						2. Comment nous utilisons vos informations
					</h3>
					<p className="text-sm">
						Nous utilisons vos informations pour :
						<br />• Fournir, exploiter et améliorer notre Service.
						<br />• Personnaliser votre expérience utilisateur en générant des
						recettes basées sur vos préférences.
						<br />• Répondre à vos demandes et demandes d&apos;assistance.
					</p>

					<h3 className="mt-4 font-semibold">3. Partage des informations</h3>
					<p className="text-sm">
						Nous ne vendons pas, n&apos;échangeons pas et ne transférons pas vos
						informations personnelles à des tiers. Nous pouvons partager des
						informations agrégées et anonymisées à des fins d&apos;analyse et
						d&apos;amélioration du Service.
					</p>

					<h3 className="mt-4 font-semibold">4. Sécurité des données</h3>
					<p className="text-sm">
						Nous mettons en œuvre des mesures de sécurité conformes aux normes
						industrielles afin de protéger vos données personnelles contre tout
						accès, divulgation, altération ou destruction non autorisés.
						Cependant, aucune méthode de transmission ou de stockage en ligne
						n&apos;est entièrement sécurisée.
					</p>

					<h3 className="mt-4 font-semibold">5. Cookies</h3>
					<p className="text-sm">
						Chef! peut utiliser des cookies et des technologies de suivi
						similaires pour améliorer votre expérience, analyser les schémas
						d&apos;utilisation et collecter des informations statistiques.
					</p>

					<h3 className="mt-4 font-semibold">6. Services tiers</h3>
					<p className="text-sm">
						Notre Service utilise l&apos;API OpenAI pour générer des recettes.
						La politique de confidentialité d&apos;OpenAI s&apos;applique aux
						données traitées par ses services. Veuillez consulter la politique
						de confidentialité d&apos;OpenAI pour plus d&apos;informations.
					</p>

					<h3 className="mt-4 font-semibold">7. Protection des enfants</h3>
					<p className="text-sm">
						Chef! n&apos;est pas destiné aux enfants de moins de 13 ans. Nous ne
						collectons ni ne sollicitons sciemment des informations personnelles
						auprès de mineurs.
					</p>

					<h3 className="mt-4 font-semibold">
						8. Modifications de cette Politique de Confidentialité
					</h3>
					<p className="text-sm">
						Nous pouvons occasionnellement mettre à jour cette Politique de
						Confidentialité. Toutes les mises à jour seront communiquées via
						notre Service. La poursuite de l&apos;utilisation du Service après
						ces modifications vaut acceptation de la politique révisée.
					</p>

					<h3 className="mt-4 font-semibold">9. Vos droits</h3>
					<p className="text-sm">
						Vous avez le droit d&apos;accéder, de rectifier ou de supprimer vos
						informations personnelles. Pour toute demande de ce type, veuillez
						nous contacter directement.
					</p>

					<h3 className="mt-4 font-semibold">10. Coordonnées de contact</h3>
					<p className="text-sm">
						Pour toute question concernant cette Politique de Confidentialité ou
						vos données, veuillez nous contacter à l&apos;adresse suivante :{" "}
						<a href="mailto:benjamin.vandamme@me.com">
							benjamin.vandamme@me.com
						</a>
						.
					</p>

					<p className="text-sm mt-2">
						En utilisant Chef!, vous acceptez les termes de cette Politique de
						Confidentialité.
					</p>
				</div>

				{/* 
          FOOTER with OK button 
        */}
				<DialogFooter>
					<Button onClick={() => setOpen(false)}>OK</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
